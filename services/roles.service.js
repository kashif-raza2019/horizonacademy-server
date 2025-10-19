const ROLES_HEIRARCHY = {
    'Administrator': 3,
    'Principal': 2,
    'Staff-Admin': 2,
    'Staff': 1,
    'Students': 0,
    'Parents': 0
};

function canAssignRole(assignerRole, targetRole) {
    if (!ROLES_HEIRARCHY.hasOwnProperty(assignerRole) || !ROLES_HEIRARCHY.hasOwnProperty(targetRole)) {
        throw new Error('Invalid role specified.');
    }
    return ROLES_HEIRARCHY[assignerRole] > ROLES_HEIRARCHY[targetRole];
}



module.exports = { canAssignRole };