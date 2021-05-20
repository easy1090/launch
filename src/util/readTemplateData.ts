const fs = require('fs');
const path = require('path');

export const readTemplateJson = () => {
  return JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../config/templateGitRepo.json'),
      'utf8'
    )
  );
};

export const writeTemplateJson = (json: any) => {
  return fs.writeFileSync(
    path.join(__dirname, '../config/templateGItRepo.json'),
    JSON.stringify(json),
    'utf8'
  );
};

export default readTemplateJson;