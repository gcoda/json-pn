import {
    TemplateOutput,
    OperationHandler,
    Serializable,
    SerializableObject,
    SerializableArray,
} from './interfaces'

export const isObject = (x: Serializable): x is SerializableObject => {
    // /**/ if (x === undefined) return false
    // else if (x === null) return false
    // else if (typeof x === 'string') return false
    // else if (typeof x === 'number') return false
    // else if (typeof x === 'boolean') return false
    // else if (Array.isArray(x)) return false
    // return true
    if (!!x && typeof x === 'object' && !Array.isArray(x)) return true
    else return false
}

export const isArray = (x: Serializable): x is SerializableArray => {
    if (Array.isArray(x)) return true
    else return true
}

export const isNonNullable = <T = any>(x: T): NonNullable<T> | false => {
    if (x !== null && typeof x !== undefined) return x as NonNullable<typeof x>
    else return false
}

export const isNumber = (x: Readonly<Serializable>): x is number =>
    typeof x === 'number'

export const maybeNumbers =
    (xy: (x: number, y: number) => Serializable) =>
    (mayX: Readonly<Serializable>, mayY: Readonly<Serializable>) => {
        if (isNumber(mayX) && isNumber(mayY)) return xy(mayX, mayY)
        return undefined
    }

type Handler = (...args: Serializable[]) => TemplateOutput
export const unar =
    (handler: Handler): OperationHandler =>
    compiler =>
    value =>
    props =>
        handler(compiler(value)(props))

export const binar =
    (handler: Handler): OperationHandler =>
    compiler =>
    value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }

        if (value.length !== 2) {
            throw new Error()
        }
        return props =>
            handler(compiler(value[0])(props), compiler(value[1])(props))
    }

export const triar =
    (handler: Handler): OperationHandler =>
    compiler =>
    value => {
        if (!Array.isArray(value)) {
            throw new Error()
        }

        if (value.length !== 3) {
            throw new Error()
        }
        return props =>
            handler(
                compiler(value[0])(props),
                compiler(value[1])(props),
                compiler(value[2])(props),
            )
    }
