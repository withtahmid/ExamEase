function now(){
    return new Date(Date.now() + (6 * 60 * 60 * 1000));
}

module.exports = {
    now
}