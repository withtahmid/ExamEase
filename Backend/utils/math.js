function max(a, b) {
    return a > b ? a : b;
}

function gradeText(x, y){
    return max(0, x * y);
}
function gradeViva(x, y){
    return max(0, x * y);
}

function gradeMCQ(x, y, score){
    return max(0, (x / y) * score);
}

module.exports = {
    max,
    gradeText,
    gradeMCQ,
    gradeViva
}