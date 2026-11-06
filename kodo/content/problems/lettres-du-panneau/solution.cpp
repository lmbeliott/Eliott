#include <iostream>
#include <string>
#include <vector>
using namespace std;

int n;
int compte[26];       // compte[c] = nombre de lettres 'A' + c encore disponibles
string mot;
vector<string> mots;

void explorer() {
    if ((int)mot.size() == n) {
        mots.push_back(mot);
        return;
    }
    // chaque lettre distincte est essayée une seule fois à cette position :
    // deux lettres identiques donneraient exactement les mêmes mots
    for (int c = 0; c < 26; c++) {
        if (compte[c] > 0) {
            compte[c]--;
            mot.push_back('A' + c);
            explorer();
            mot.pop_back();
            compte[c]++;
        }
    }
}

int main() {
    string lettres;
    cin >> lettres;
    n = lettres.size();
    for (char ch : lettres) compte[ch - 'A']++;
    explorer();
    cout << mots.size() << "\n";
    for (const string& m : mots) cout << m << "\n";
    return 0;
}
