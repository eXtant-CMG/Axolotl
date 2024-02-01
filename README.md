[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Axolotl XML Editor

This lightweight editor has been developed as an embeddable tool for online digital scholarly editions, providing the users with the ability to work on the same files simultaneously. Axolotl makes use of CodeMirror and Operational Transformation to achieve this. This is currently a beta version.

![Example](https://drive.google.com/uc?id=179KiNejoK7kViUKTJ6eDuztvr6M0t5Qc)

## Composition

Axolotl is in its core a React component and could be placed separately in any web project as a dynamic island or in tandem with other components. The backend support and database adapters are left for the users to decide. A sample code, however, can be found in [this repository](https://github.com/NoonShin/Axolotl-Server).

## Features

- XML well-formedness and validity check
  - Possibility of schema addition in development
    
  ![Validation](https://drive.google.com/uc?export=view&id=1hBSQ1wNY5ShdxmEhV4uIoisej1AxDFrj)

- Context-aware autocomplete suggestions
  
  ![Autocomplete Suggestions](https://drive.google.com/uc?export=view&id=1qysXwUn-a9xYBqcAsrbLpsQnD847fhiU)

- Cursor view for online users
  
  ![Cursor View](https://drive.google.com/uc?export=view&id=16p1PhOFZtJtngIt9yvbZ2oe-2OhWGwFA)

- Annotation support
  
  ![Annotation](https://drive.google.com/uc?export=view&id=1Pm8IrMsWeEZDJcv0kyo9RO1BmuOWaj8y)
