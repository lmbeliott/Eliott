#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// a doit passer strictement avant b si a + b > b + a
bool avant(const string& a, const string& b) {
    return a + b > b + a;
}

int main() {
    int n;
    cin >> n;
    vector<string> mots(n);
    for (int i = 0; i < n; i++) {
        cin >> mots[i];
    }
    sort(mots.begin(), mots.end(), avant);
    string resultat = "";
    for (const string& m : mots) {
        resultat += m;
    }
    if (resultat[0] == '0') {      // que des zéros
        resultat = "0";
    }
    cout << resultat << "\n";
    return 0;
}
