export const templateContentJobPosting = (data: any) => {
  const template = `<p>Description Post</p><p></p><p>1. Job Description </p><p>{job_description}</p><p></p><p>2. Required Qualification </p><p>{required_qualification}</p><p></p><p>3. Work Experience </p><p>{experiences}</p><p></p><p>4. Specific Skills </p><p>{specific_skills}</p><p></p><p>5. Benefits</p><p></p>`;
  let skill = `
${
  data?.certificate &&
  `<p>Certificate</p><p>${data?.certificate ? data?.certificate : ""}</p>`
}
${
  data?.computer_skill &&
  `<p>Computer</p><p>${data?.computer_skill ? data?.computer_skill : ""}</p>`
}
${
  data?.language_skill &&
  `<p>Computer</p><p>${data?.language_skill ? data?.language_skill : ""}</p>`
}
${
  data?.other_skill &&
  `<p>Others</p><p>${data?.other_skill ? data?.other_skill : ""}</p>`
}
`;
  const result = template
    .replace("{job_description}", data.jobdesc)
    .replace("{required_qualification}", data.required_qualification)
    .replace("{experiences}", data.experiences)
    .replace("{specific_skills}", skill);

  return result;
};
