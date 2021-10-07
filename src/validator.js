import * as yup from 'yup';

export default (field, addedLinks) => yup
  .string()
  .required()
  .url()
  .notOneOf(addedLinks)
  .validate(field);
