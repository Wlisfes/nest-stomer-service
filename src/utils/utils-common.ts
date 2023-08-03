/**延时方法**/
export function divineDelay(delay = 100, handler?: Function) {
	return new Promise(resolve => {
		const timeout = setTimeout(async () => {
			resolve(await handler?.())
			clearTimeout(timeout)
		}, delay)
	})
}

/**条件链式执行函数**/
export async function divineHandler(fn: boolean | Function, handler: Function) {
	if (typeof fn === 'function') {
		if (fn()) {
			return handler && handler()
		}
	} else if (!!fn) {
		return handler && handler()
	}
	return undefined
}

/**数组转树结构**/
export function listToTree<T extends Record<string, any>>(
	data: Array<T>,
	status: Array<'disable' | 'enable' | 'delete'> = []
) {
	const tree: Array<T> = []
	const map: Object = data.reduce((curr: Object, next: T & { children: Array<T>; id: number }) => {
		next.children = []
		curr[next.id] = next
		return curr
	}, Object.assign({}))
	data.forEach((node: T) => {
		if (node.parent) {
			if (status.length === 0 || status.includes(node.status)) {
				map[node.parent].children.push(node)
			}
		} else {
			if (status.length === 0 || status.includes(node.status)) {
				tree.push(node)
			}
		}
	})
	return tree
}

/**树结构转数组**/
export function treeToList(tree) {
	const result = []
	for (const node of tree) {
		const children = node.children
		delete node.children
		result.push(node)
		if (children && children.length > 0) {
			const childrenNodes = treeToList(children)
			result.push(...childrenNodes)
		}
	}
	return result
}

/**删除树结构叶子节点children字段**/
export function delChildren(data = []) {
	data.forEach(node => {
		if ((node.children ?? []).length === 0) {
			node.isLeaf = true
			delete node.children
		}
		delChildren(node.children)
	})
	return data
}
