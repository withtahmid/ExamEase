function timeIsBetween(time, startTime, endTime) {
    const timeObj = new Date(time);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);
    return timeObj >= startTimeObj && timeObj <= endTimeObj;
}

// // Example usage
// const result = timeIsBetween("2023-11-18T12:35:00.000Z", "2023-11-18T12:30:00.000Z", "2023-11-18T12:40:00.000Z");
// console.log(result); // This should now correctly return true.


