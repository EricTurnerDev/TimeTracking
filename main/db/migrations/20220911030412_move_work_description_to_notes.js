exports.up = function (knex) {
    return knex('time_records').update({
        notes: knex.raw("COALESCE(notes, '') || '###' || COALESCE(work_description, '')"),
        work_description: ''
    });
};

exports.down = function (knex) {
    return knex('time_records').update({
        work_description: knex.raw("substr(notes, instr(notes, '###')+3, length(notes))"),
        notes: knex.raw("substr(notes, 0, instr(notes, '###'))")
    });
};
