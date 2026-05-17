export const parseBranchPreferences = (enquiry = {}) => {
  let branches = enquiry.branchesInterested;

  if (!branches) return [];
  if (typeof branches === 'string') {
    try {
      branches = JSON.parse(branches);
    } catch {
      return [];
    }
  }

  return Array.isArray(branches)
    ? branches
        .filter(item => item && item.branch)
        .map(item => ({ ...item, priority: Number(item.priority || 0) }))
        .sort((a, b) => a.priority - b.priority)
    : [];
};

export const getBranchByPriority = (enquiry, priority) => (
  parseBranchPreferences(enquiry).find(branch => Number(branch.priority) === Number(priority))?.branch || ''
);

export const getMaxBranchPriority = (enquiries = [], branchOptions = []) => {
  const maxSavedPriority = Math.max(
    0,
    ...enquiries.flatMap(enquiry => parseBranchPreferences(enquiry).map(branch => Number(branch.priority || 0)))
  );
  return Math.max(maxSavedPriority, branchOptions?.length || 0);
};

export const buildBranchPriorityFields = (enquiries = [], branchOptions = []) => (
  Array.from({ length: getMaxBranchPriority(enquiries, branchOptions) }, (_, index) => ({
    key: `branchPriority${index + 1}`,
    label: `Priority ${index + 1}`,
    priority: index + 1
  }))
);

export const enquiryMatchesBranchFilters = (enquiry, branchFilter, priorityFilter) => {
  const branches = parseBranchPreferences(enquiry);

  if (!branchFilter && !priorityFilter) return true;

  return branches.some(item => {
    const branchMatches = !branchFilter || String(item.branch).toLowerCase() === String(branchFilter).toLowerCase();
    const priorityMatches = !priorityFilter || String(item.priority) === String(priorityFilter);
    return branchMatches && priorityMatches;
  });
};
