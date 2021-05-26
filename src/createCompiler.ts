import { Compiler, SerializableObject } from './interfaces'
import { defaultOperationsMap } from './defaultOperatorsMap'

export function createCompiler(operatorsMap = defaultOperationsMap): Compiler {
    const compiler: Compiler = template => {
        switch (typeof template) {
            case 'number':
            case 'string':
            case 'boolean':
                return () => template
            case 'object':
                if (template === null) return () => null

                if (Array.isArray(template)) {
                    return props => template.map(item => compiler(item)(props))
                }

                for (let i = 0; i < operatorNames.length; i++) {
                    const name = operatorNames[i]
                    let parameters = template[name]
                    if (parameters !== undefined) {
                        if (Object.keys(template).length !== 1) {
                            throw new Error('only one key is allowed')
                        }
                        const operator = operators[i]
                        return operator(parameters)
                    }
                }

                return props => {
                    const res: SerializableObject = {}
                    Object.keys(template).forEach(key => {
                        res[key] = compiler(template[key])(props)
                    })
                    return res
                }

            default:
                return () => undefined
        }
    }

    const operatorNames = Object.keys(operatorsMap)

    const operators = operatorNames.map(name => operatorsMap[name](compiler))

    return compiler
}
