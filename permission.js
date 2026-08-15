let permission  = [
    {
        role : 'student',
        permission : [
            'view_profile', 
            'view_materials', 
            'submit_assignment', 
        ]
    },
    {
        role : 'teacher',
        permission : [
            'create_materials', 
            'update_materials', 
            'delete_own_materials',
        ]
    },
    {
        role : 'admin',
        permission : ['all'] 
    }
]

module.exports = permission