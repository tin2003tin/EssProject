#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
  int lengthOfLongestSubstring(string s) {
       int max_sub = 0;
       string sub = "";
       cout<< s.length() << endl;
       for (int i = 0 ; i < s.length(); i++) {
           int found = -1;
           for (int j = 0 ; j < s.length();j++) {
               if (s[i] == sub[j]) {
                   found = j; 
                   break;
               } 
           }
           if (found != -1) {
               sub = "";
               sub += s[i];
           }
           sub += s[i];
           cout << "1234" << sub << "1234" << endl;
           cout << sub.length()<< endl;
           if (sub.length() > max_sub) {
               max_sub = sub.length();
           }
       }
       if (max_sub == 0 || max_) {
           return max_sub;
       }
       return max_sub-1;
    }
};

int main() {
    Solution solution;
    string s = " ";
    cout << "Length of longest substring without repeating characters: " << solution.lengthOfLongestSubstring(s) << endl;
    return 0;
}
