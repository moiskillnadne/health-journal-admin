import { object, string, array, number, boolean } from 'yup';

const TrackSchema = object({
  id: string(),
  titleEn: string().max(128).required(),
  titleSp: string().max(128),
  targetGroups: array().min(1).required(),
  groups: array()
    .of(
      object({
        order: number(),
        schedule: string().required(),
        lines: array()
          .of(
            object().shape(
              {
                order: number(),
                video: object({
                  label: string().required(),
                  id: string().required(),
                })
                  .nullable(true)
                  .when(['article', 'recipe'], {
                    is: (recipe: any, article: any) => !recipe && !article,
                    then: object()
                      .nullable(true)
                      .required('At least one content field is required.'),
                  }),
                article: object({
                  label: string().required(),
                  id: string().required(),
                })
                  .nullable(true)
                  .when(['video', 'recipe'], {
                    is: (video: any, recipe: any) => !recipe && !video,
                    then: object()
                      .nullable(true)
                      .required('At least one content field is required.'),
                  }),
                recipe: object({
                  label: string().required(),
                  id: string().required(),
                })
                  .nullable(true)
                  .when(['article', 'video'], {
                    is: (video: any, article: any) => !video && !article,
                    then: object()
                      .nullable(true)
                      .required('At least one content field is required.'),
                  }),
              },
              [
                ['article', 'recipe'],
                ['video', 'article'],
                ['video', 'recipe'],
              ],
            ),
          )
          .required(),
      }),
    )
    .min(1),
  isPublished: boolean(),
});

export default TrackSchema;
