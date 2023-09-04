export interface IDrugRxcuiResponse {
  drugGroup: {
    name?: string,
    conceptGroup: {
      tty: string,
      conceptProperties?: {
        rxcui: string,
        name: string,
        synonym: string,
        tty: string,
        language: string,
        suppress: string,
        umlscui: string
      }[]
    }[]
  }
}

export interface IDrugDrugInteractionResponse {
  nlmDisclaimer: string,
  fullInteractionTypeGroup?: {
    sourceDisclaimer: string,
    sourceName: string,
    fullInteractionType: {
      comment: string,
      minConcept: {
        rxcui: string,
        name: string,
        tty: string
      }[],
      interactionPair: {
        interactionConcept: {
          minConceptItem: {
            rxcui: string,
            name: string,
            tty: string
          },
          sourceConceptItem: {
            id: string,
            name: string,
            url: string
          }
        }[],
        severity: string,
        description: string
      }[]
    }[]
  }[]
}

export interface IInteractionNotificationDTO {
    medicines: {
      genericName: string,
      tradeName: string,
      url: string
    }[]
    severities: string[],
    descriptions: string[]
}
