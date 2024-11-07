# TEMPLATE FOR RETROSPECTIVE (Team 17)

The retrospective should include _at least_ the following
sections:

- [PROCESS MEASURES](#process-measures)
- [QUALITY MEASURES](#quality-measures)
- [GENERAL ASSESSMENTS](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done
  - committed: 6
  - done: 6
- Total points committed vs. done
  - committed: 18
  - done: 18
- Nr of hours planned vs. spent (as a team)
  - planned: 81h 15m
  - spent: 79h 25m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story                                           | # Tasks | Points | Hours est. | Hours actual |
| ----------------------------------------------- | ------- | ------ | ---------- | ------------ |
| _#0_                                            | 11      |        | 31h 15m    | 34h 10m      |
| 01 - Add document description                   | 3       | 3      | 8h         | 7h           |
| 02 - Link documents                             | 3       | 3      | 8h         | 7h 30m       |
| 03 - Georeference a document                    | 3       | 3      | 6h         | 4h 45m       |
| 04 - View documents on map                      | 5       | 5      | 13h        | 11h          |
| 05 - Adjust/Define georeferencing of a document | 5       | 3      | 12h        | 12h 30m      |
| 06 - Add table to list all documents            | 1       | 1      | 3h         | 2h 30m       |

- Hours per task average, standard deviation (estimate and actual)
  - task average:
    - estimated: 2.62 h
    - actual: 2.56 h
  - standard deviation:
    - estimated: 2.5557 h
    - actual: 2.6045 h
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = -0.0226$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_{task_i}}-1 \right| = 0.00095193 $$

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 9h
  - Total hours spent: 10h 30m
  - Nr of automated unit test cases: 66
  - Coverage (if available): 100%
- E2E testing:
  - Total hours estimated: 3h
  - Total hours spent: 3h
- Code review
  - Total hours estimated: 4h
  - Total hours spent: 4h

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - we encountered some unforseen issues with coding environments and unexpected bugs occured.
    including having problem with some module dependencies that made it hard to run some of the backend tests using jest library.

  - it was sometimes challenging to implement some complex feature, such as inserting different documents as points on the map or linking documents to each other.
    Each document had unique details, which sometimes required more setup and configuration than expected (like specifying an area), expecially when
    posting and updating a document's attributes. This led to longer times for tasks we initially thought would be somehow simpler.

  - Another challenge in our estimates came from unexpected issues with mapping document points and handling their location consistently.
    so our estimation errors were due to the extra steps involved in handeling document locations. as well as having no prior experience in working with maps.

- What lessons did you learn (both positive and negative) in this sprint?

  - Positive:

    - Regular team checks and meetings helped us catch errors early, and working together helped to understand the project requirements better.

    - We also learned more about handling maps and integrating different features. The experience will be valuable for similar tasks going forward.
    - It also showed us that regular updates help prevent small issues from turning into larger problems. as well as breaking down tasks into separate parts.

  - Negative:

    - We underestimated how dependencies could slow down our workflow. Without the map points ready, it was hard to add document details efficiently, which caused delays.
      We need to make sure dependencies are clear from the start.

    - Not all requirements were clear, and this led to some rework and delays. Going forward,
      we learnt the need for checking all details with the team and stakeholders before moving into coding.

- Which improvement goals set in the previous retrospective were you able to achieve?

  - Enhance Task Break down: We broke down tasks so we managed to observe details better and due to that in this sprint our estimation was more accurate.
  - Optimize Code Review Process: The review process improved and getting feedbacks was faster as we dedicated some time to that and also teammates begin to know each other better and communicate more.

  - Partially Achieved: We worked on reducing bugs and saw improvement, though a few minor issues with document details on the map still needed adjustments after initial testing

- Which ones you were not able to achieve? Why?
  - we almost achieved all we wanted to but as we are moving forward as a team we need to set goals continuously to improve ourself and can adapt with new conditions in the project.
    But also sometimes due to overlapping dependencies, some parts couldn’t be completed simultaneously. This made it a bit hard to keep all tasks moving at the same pace, as some were waiting on others to be finished.
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Improve Requirement Gathering: We’ll go over requirements in more detail at the start of the sprint. By discussing specific needs for each User Story, we can avoid unexpected adjustments during development.

  - More cooperation between backend and frontend part of the team. As tasks may sometimes not be equal, so in this way the team can work faster and there won’t be any pressure on teammates.
    although we are currently following this approach

- One thing you are proud of as a Team!!
  - We’re proud of the teamwork and commitment everyone showed. the team was flexible and supportive, which kept us moving forward.
    We also managed to communicating better with each other and everyone was willing to help in case of any unexpected issues
