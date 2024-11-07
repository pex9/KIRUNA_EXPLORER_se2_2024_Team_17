TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

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

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |  11     |        | 31h 15m    |     34h 10m  |
| 01 - Add document description                  |  3  |  3  | 8h  | 7h      |
| 02 - Link documents                            |  3  |  3  | 8h  | 7h 30m  |
| 03 - Georeference a document                   |  3  |  3  | 6h  | 4h 45m  |
| 04 - View documents on map                     |  5  |  5  | 13h | 11h     |
| 05 - Adjust/Define georeferencing of a document|  5  |  3  | 12h | 12h 30m |
| 06 - Add table to list all documents           |  1  |  1  | 3h  | 2h 30m  |


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

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

- One thing you are proud of as a Team!!