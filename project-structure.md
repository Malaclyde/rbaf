This file tries to standardize a framework for agentic project development. This framework tries to cover how to save the knowledge that models project development stages and overall project information. It should be seen as a seed 

# Documentation structure
The project documentation should be structured in a way that:
- tries to avoid repetition between different sections
- has a public section visible in the project root dir
- has a section for the agents that is nested inside specific folders
- all documentation is written in human-readable well-known format
- all documentation is auditable by humans
- all documentation is git-safe (no secrets, etc.)
- the purpose of the section for the agents is to properly capture planning and project history (what has already been implemented, what is planned as next - so that the project history would not die with the context of an editing llm)

# The public section
Saved in the project root directory in three files:
- `README.md` - project card; how to run the project; who ist this for, etc.
- `CHANGELOG.md` - changes included in the project's milestones
- `ROADMAP.md` - planned milestones
- `CONTRIBUTING.md` - contributing rules, commit and PR structure

## readme
[research needed: how should be the readme file structured based on the most common readme patterns that exist today and also to properly reflect this project structure?]
## changelog
denotes milestones that have been completed
## roadmap
denotes milestones planned for the future
## contributing
[research needed: how should be the contributing file structured based on the most common readme patterns that exist today and also to properly reflect this project structure?]

# The agent section
Split into *planning* and *docs*.

## Planning
Located in the `.planning` folder. Contains the following structure:
```markdown
<project-root>/
|- .planning/
    |- mode.md
    |- sprints/
        |- <sprint-codename>/
            |- phases.md
            |- spec/
                |- phase-<number>.md
        ... [for each sprint]
    |- requirements/
        |- <feature|bugfix|research|discussion>_<descriptive_abbreviation>.md
        ... [for each requirement]
    |- milestones/
        vX.Y.Z.md
        ... [for each milestone]
```

### mode.md
Contains a single line with the current mode of operation. Possible values:
- human-in-the-loop
- autonomous
This setting influences how `discussion` and `research` is handled when it is necessary. In the `human-in-the-loop` mode, the discussion should take place between an agent and a human. In the `autonomous` mode, the discussion should take place between a number of agents. This does not apply at the beginning of the project development or project mapping. The initial phase must always be initiated with a human.

### Sprints
A sprint is a planning entity that is used to annotate the current task list - what is currently being developed. Each sprint has a codename [reseach needed: is it possible to quickly generate names in a similar way as done by docker], a list of phases and a spec. The overall rule of thum is: the `phases.md` file contains information about the logical ordering of tasks pulled into this spring from requirements definitions and the status of implementation. The `spec` directory provides implementation specification for each logical ordering unit from the `phases.md` document. The agent that handles orchestration does not need to inlcude the implementation spec into their context, because the files are separate. Furthermore, the implementation specification is also split into separate files for each logical ordering unit from the `phases.md` document - therefore, the implementation agets also don't need to load the whole implementation spec into their contexts. *Caveat*: when a phase contains multiple tasks which will be executed in parallel by different agents, each of those agets reads the spec for the whole phase implementation and finds the parts that regard their assigned task. [research needed: would we benefit from splitting the phase spec for each task into a different file?]

#### tasks.md
A list of phases - each phase is a unit that guides implementation. It groups requirements tasks to denote the ordering in which the tasks should be implemented. Each phase has a sequential number and a list of links to the tasks from a certain requirement from the `requirements` directory. Phases are executed sequentially, however if a phase contains more than one task in its list, that means that these tasks should be implemented in parallel. The structure of the file:
```markdown
# phase-<number>
- status: [done|in-progress|planned]
- notes:
- tasks:
  - [task-<number>](.planning/requirements/<requirement-name>.md#task-<number>) [research needed: how to best link the files - absolute vs relative paths]
    - status: [done|in-progress|planned]
    - notes:
  - ... [possibly more tasks] 
# ... [next phases]
```
The `notes` section should be used to denote only problems that occured during implementation - for status information, use the `status` field. Information from the `notes` sections will be used during retro to possibly enhance the development process - ideally the `notes` section is empty. 

#### spec
This directory contains the implementation plan that covers the phases from the `phases.md` file. Each phase has its own dedicated file that contains a detailed implementation plan. Each file is scoped into sections that map directly to tasks pulled from the phase definition. Each task section has an implementation and verification section. Unittests are part of the implementation. Verification should include instructions on how to validate the implementation based on the requirement description rather than code - something in the taste of black box testing. The structure of a singular the `spec/phase-<number>` document is:
```markdown
# [task-<number>]
## implementation
1. step <step-number>
  <implementation-details>
2. ... [more implementation steps]
*note*: this section should always include creating / updating the test suite and running linters / building the project; depending on the specifics, testing can be executed after each step or at the end of the implementation section
## verification
1. step <step-numer>
  <verification-details>
2. ... [more verification steps]
# ... [next tasks]
```

### Requirements
Each requirement can be one of the following types:
- feature
- bugfix
- research
- discussion
Each requirement has also a descriptive name which is the abbreviation of its real title - `<component-id>_<number>` (e.g. `DSGN_01`, if the project has a component with the id: `DSGN`; in this example the filename of the requirement is thus: `feature_DSGN_01.md`, assuming it is a feature). Each requirement has a: 
- definition
- list of tasks
- definition of done
- notes
The structure of the file:
```markdown
# definition
[a detailed definition of the requirement, a clear specification of its goals]
# tasks
## task-<number>
[a detailed description of the task scope]
[this is the unit that gets pulled into a specific sprint]
## ... [next tasks]
# definition-of-done
[detailed bullet point list]
- [ ] dod-1 ...
- [ ] dod-2 ...
- [ ] ...
# notes
[caveats, additional notes, information that was not inluded in the above sections but is necessary to the project]
```

### Milestones
Each milestone represents a version of the project - each version has a major, minor and patch number (semantic versioning) and is denoted as vX.Y.Z. A milestone is a group of requirements. Format:
```markdown
vX.Y.Z
requirements:
- [requirement-name](requirement-file-path)
```

## Docs
Located in the `.docs` folder, contains the following structure:
```markdown
<project-root>/
|- .docs/
    |- outline.md
    |- design.md
    |- project-structure.md
    |- components/
        |- <component-id>.md
        ... [for each component]
```

### outline.md
A high-level overwiev of the project. What it comprises of. Describes the goals of the project and its sub-components. Inlcudes explanations how the components interact with each other and why are they necessary. Covers selected languages, frameworks and libraries.

### design.md
Describes the desing strategy scoped on the whole project. This is about the visual layer (if the project has one)
[reserach needed: how should the design.md file be structured: https://github.com/google-labs-code/design.md]

### project-structure.md
This framework takes into account that for some project this structure may not be the best solution. Information about how project is strucutred should be thus saved in this file for each project. It can be an exact copy of this document or it can represent something entirely different. The most important thing here is, that we do not hard-code the project structure to the system prompts of agents that are working on a project. We leave this description to be saved in the project itself - so it can easily evolve with the project and be amended for the project needs.

### components
Each component needs a description that has three parts:
```markdown
# summary
detailed description of the component
# research
information aquired during research
# design decisions
important design decisions. Contains:
- graphic design (following google's design.md) - expand on the design.md document of the whole project if necessary
- architectural design (used libraries, frameworks, etc.)
```
