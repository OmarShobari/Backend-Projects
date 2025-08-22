let obj = {};
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxFrequencyElements = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    obj[nums[i]] = 1;
  }
  const numberOfAttributes = Object.keys(obj).length;
  return numberOfAttributes;
};
nums = [15];
res = maxFrequencyElements(nums);
console.log(res);
