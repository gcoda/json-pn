/**
 * Serializable object can be serialized to pure JSON string
 */
export interface SerializableArray extends Array<Serializable> {}

export type Serializable =
    | undefined
    | null
    | boolean
    | number
    | string
    | SerializableArray
    | { [index: string]: Serializable }

export type SerializableObject = Record<string, Serializable>
/**
 * Valid template JSON object
 */
export type TemplateObject = Serializable

/**
 * Tampate Output object
 */
export type TemplateOutput = Serializable

/**
 * Function created by  Compiler from Template
 */
export interface TemplateFunction<P> {
    (props: P): TemplateOutput
}

/**
 * Compiler uses Template object ro create Template function
 */
export interface Compiler<P = SerializableObject> {
    (template: TemplateObject): TemplateFunction<P>
}

export interface OperationHandler<P = SerializableObject> {
    (compile: Compiler<P>): (
        value: TemplateObject,
    ) => (props: P) => TemplateOutput
}

export interface OperationsMap {
    [OperationName: string]: OperationHandler
}
