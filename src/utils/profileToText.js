/**
 * Convert combined profile to a single text string for CV matching
 */
export const convertProfileToText = profile => {
  if (!profile) return "";

  const parts = [];

  // Personal Detail
  if (profile.personalDetail) {
    const pd = profile.personalDetail;
    if (pd.fullName) parts.push(`Name: ${pd.fullName}`);
    if (pd.title) parts.push(`Current Title: ${pd.title}`);
    if (pd.email) parts.push(`Email: ${pd.email}`);
    if (pd.phone) parts.push(`Phone: ${pd.phone}`);
    if (pd.address) parts.push(`Address: ${pd.address}`);
    if (pd.bio) parts.push(`Bio: ${pd.bio}`);
  }

  // About Me
  if (profile.aboutMe?.text) {
    parts.push(`About Me: ${profile.aboutMe.text}`);
  }

  // Education
  if (profile.education && profile.education.length > 0) {
    const eduText = profile.education
      .map(edu => {
        const eduParts = [];
        if (edu.degree) eduParts.push(edu.degree);
        if (edu.field) eduParts.push(`in ${edu.field}`);
        if (edu.school) eduParts.push(`from ${edu.school}`);
        if (edu.startDate || edu.endDate) {
          eduParts.push(
            `(${edu.startDate || ""} - ${edu.endDate || "Present"})`
          );
        }
        if (edu.description) eduParts.push(`- ${edu.description}`);
        return eduParts.join(" ");
      })
      .join("; ");
    parts.push(`Education: ${eduText}`);
  }

  // Work Experience
  if (profile.workExperience && profile.workExperience.length > 0) {
    const expText = profile.workExperience
      .map(exp => {
        const expParts = [];
        if (exp.position) expParts.push(exp.position);
        if (exp.companyName) expParts.push(`at ${exp.companyName}`);
        if (exp.startDate || exp.endDate) {
          expParts.push(
            `(${exp.startDate || ""} - ${exp.endDate || "Present"})`
          );
        }
        if (exp.description) expParts.push(`- ${exp.description}`);
        return expParts.join(" ");
      })
      .join("; ");
    parts.push(`Work Experience: ${expText}`);
  }

  // Skills
  if (profile.canidateSkills && profile.canidateSkills.length > 0) {
    const skillsText = profile.canidateSkills
      .map(skill => {
        return skill.proficiency
          ? `${skill.name} (${skill.proficiency})`
          : skill.name;
      })
      .join(", ");
    parts.push(`Technical Skills: ${skillsText}`);
  }

  // Soft Skills
  if (profile.softSkills && profile.softSkills.length > 0) {
    const softSkillsText = profile.softSkills
      .map(skill => {
        return skill.proficiency
          ? `${skill.name} (${skill.proficiency})`
          : skill.name;
      })
      .join(", ");
    parts.push(`Soft Skills: ${softSkillsText}`);
  }

  // Languages
  if (profile.languages && profile.languages.length > 0) {
    const langText = profile.languages
      .map(lang => {
        return lang.proficiency
          ? `${lang.name} (${lang.proficiency})`
          : lang.name;
      })
      .join(", ");
    parts.push(`Languages: ${langText}`);
  }

  // Certificates
  if (profile.certificates && profile.certificates.length > 0) {
    const certText = profile.certificates
      .map(cert => {
        const certParts = [];
        if (cert.name) certParts.push(cert.name);
        if (cert.organization) certParts.push(`from ${cert.organization}`);
        if (cert.issueDate) certParts.push(`(${cert.issueDate})`);
        return certParts.join(" ");
      })
      .join("; ");
    parts.push(`Certificates: ${certText}`);
  }

  // Awards
  if (profile.awards && profile.awards.length > 0) {
    const awardText = profile.awards
      .map(award => {
        const awardParts = [];
        if (award.name) awardParts.push(award.name);
        if (award.organization) awardParts.push(`from ${award.organization}`);
        if (award.date) awardParts.push(`(${award.date})`);
        if (award.description) awardParts.push(`- ${award.description}`);
        return awardParts.join(" ");
      })
      .join("; ");
    parts.push(`Awards: ${awardText}`);
  }

  return parts.join("\n\n");
};
