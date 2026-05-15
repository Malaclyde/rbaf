# mode of operation
familiarize yourself with the environment (the codebase, existing instrucion files). Specifically look for files that tell you more about the project structure. Recognize if you are in an initialized project or an uninitialized project.

## initialied projects
If the project already contains files that describe its structure, planning, milestones, etc. and it is clear what the current state of the project is, it is already initialized. Your job is done, however the user may request something extra - explain that you think that this project is already initialized and ask the user for their intention.

## unintialized projects
If the project does not contain files that describe its structure, regardless if the project already has a codebase, project initialization is required. Project initialization is also required, if the project contains files that document its structure and progress but they are incomplete - or something needs fixing.

Project initialization is a process that revolves around a discussion with the user to fully understand their vision and project goals. During the initialization you have to capture:
- project type;
- necessary project components;
- high-level design view of the project;
- the complexity of documentation of the project progress.

Follow these steps to initialize the project:
1. Does the project already have a codebase?
  - yes -> run a codebase scan to understand what the project is, what is delivered and what the status of the implementation is; extrac the necessary information from the codebase
  - no  -> just proceed with the next step
2. Start a discussion with the user to complete the project initialization process - clarify the areas that you would normally extract from the codebase. Clarify all the gaps / grey areas that exist. During the discussion, make sure to track the discussion progress and all the decisions that have been agreed upon by the user to a temporary file in case of context overflow during the discussion. After this discussion, you both should clearly agree on:
  - the overall goal of the project;
  - project type;
  - necessary project components;
  - high-level design view of the project;
the specifics should be persisted in the temporary file.
3. Based on the user input (make sure to take into account the entirety of the temporary file), create the project structure. Use the standard layout at first. Reason if the standard layout is suitable for this project - maybe the project is smaller / bigger and requires a slightly altered project structure. Make your alterations if necessary and make sure to persist the project structure rules to a file that describes the project structure so that future agents clearly know how to work on this project and update its progress documentation.
4. Present the structure to the user
5. If the user would like to change the project structure, discuss it with them, however don't be eager to introduce much changes. Always cross-check what the user suggests with what is best for the project.

**what information to extract from the exising codebase**
- type of the project
- building blocks of the project - its components
- design decisions
- language / frameworks / libraries / patterns
- any other necessary info

**how to discuss the project with the user**
1. extract the type of the project from user's input
2. the project might be complex and consist multiple building blocks that make it work (its components); the user will not mention all of them and probably will not structure their input in a way that clearly separates each component from another
3. you have to split the overall user requirements into smaller logic units that circle around a single functionality / area (like frontend and backend; networking layer and database layer, etc.)
4. based on the project type, always research the best community practises regarding development of this project type; research the components that are typically necessary in such projects

At the end of the project initialization, the following should be documented:
- project outline:
  contains a high-level overwiev of the project; its components and how they relate to each other
- design decisions:
  what is the language / framework
- project structure:
  a file that clearly denotes the project structure and rules about how to operate within this structure

Your task is not to create plans for future development but deeply research the existing technologies that are suitable for this project and help the user make the correct design decisions. When you are done, the structure to denote planning and documenting the project should be in-place.

### standard project structure
-> copy-paste the description from @project-structure.md

## notes
- generally, the sole existence of a README.md file is not enough to properly manage project development; in that case suggest to the user to initiate detailed project structure and documentation files that will make AI project development possible
- common locations of the project documentation:
  - `.docs/project-structure.md`
  - `.planning/`
  - `docs/`
