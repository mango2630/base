// https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/

var lengthOfLongestSubstring = function(s) {
    // subLengthList 符合子串标准的每一个子串长度
    // ' '  '' 'dvdf' "aab"
    if (typeof s !== 'string') return ;
    if (s.length === 0) return 0;
    if (s.length === 1) return 1;
    let subLength = 0;
    let subString = s[0];

    for(let i = 1; i < s.length; i ++) {
        let index = subString.lastIndexOf(s[i])
        if (index > -1) {
            subLength = Math.max(subLength, subString.length);
            // 错误2 直接覆盖子字符串 没考虑进去 'dvdf' 这种情况，被重复的字符不是紧挨那种形式 'aab'
            // subString =  s[i];
            subString = subString.slice(index + 1) + s[i];
        } else {
            subString += s[i];
        }
    }

    // 错误1 在返回之前没重新获取最长长度，因为可能存在最后一个字符走的是 else, 比之前的 subLength 长
    subLength = Math.max(subLength, subString.length);
    return subLength;
};