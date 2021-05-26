import { OperationsMap, Serializable, SerializableObject } from './interfaces'
import { unar, binar, triar, isObject, isArray, maybeNumbers } from './tools'
/**
 * Extract value from object by path
 * @param target Target object
 * @param path path array
 * @returns value or undefined
 */

const extract = (target: Serializable, path: string[]): Serializable => {
    if (path.length === 0) {
        return target
    } else {
        if (!isObject(target)) return undefined
        const [key, ...subpath] = path
        const targetField = target?.[key]
        if (targetField) {
            return extract(targetField, subpath)
        } else {
            return undefined
        }
    }
}

export const defaultOperationsMap: OperationsMap = {
    // Extract value from properties
    '@': compiler => value => props => {
        const compiledValue = compiler(value)(props)
        const path = Array.isArray(compiledValue)
            ? compiledValue
            : [compiledValue]

        return extract(
            props,
            path.filter((p): p is string => typeof p === 'string'),
        )
    },
    // Avoid processing of value
    '@escape': compiler => value => props => value,
    // logical operators
    '@not': unar(x => !x),
    '@and': binar(maybeNumbers((x, y) => x && y)),
    '@or': binar(maybeNumbers((x, y) => x || y)),
    // comparation operators
    '@lt': binar(maybeNumbers((x, y) => x < y)),
    '@le': binar(maybeNumbers((x, y) => x <= y)),
    '@eq': binar(maybeNumbers((x, y) => x === y)),
    '@ge': binar(maybeNumbers((x, y) => x >= y)),
    '@gt': binar(maybeNumbers((x, y) => x > y)),
    // mathematical operators
    '@add': binar(maybeNumbers((x, y) => x + y)),
    '@sub': binar(maybeNumbers((x, y) => x - y)),
    '@mul': binar(maybeNumbers((x, y) => x * y)),
    '@div': binar(maybeNumbers((x, y) => x / y)),
    //
    '@if': triar((opt, yes, no) => (opt ? yes : no)),
    // array
    '@map': compiler => value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }
        if (value.length !== 4) {
            throw new Error()
        }
        const list = compiler(value[0])

        const map = value[1]
        const valueTemplate = compiler(value[2])
        const indexTemplate = compiler(value[3])
        return props => {
            if (typeof props === 'object') {
                const compiledList = list(props)

                const valueKey = valueTemplate(props)
                const valueName =
                    typeof valueKey === 'string' ? valueKey : 'value'

                const indexKey = indexTemplate(props)
                const indexName =
                    typeof indexKey === 'string' ? indexKey : 'index'

                if (isArray(compiledList))
                    return compiledList.map((value, index) => {
                        const extended = {
                            ...props,
                            [valueName]: value,
                            [indexName]: index,
                        }
                        return compiler(map)(extended)
                    })
            }
        }
    },
}
