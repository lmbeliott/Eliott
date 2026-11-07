#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<string> morceaux;

// valeur de l'expression qui commence au morceau i ; i avance jusqu'au morceau qui la suit
long long evaluer(int &i) {
    string t = morceaux[i];
    i++;
    if (t != "+" && t != "-" && t != "*") {
        return stoll(t);
    }
    long long a = evaluer(i);   // première opérande
    long long b = evaluer(i);   // seconde opérande
    if (t == "+") return a + b;
    if (t == "-") return a - b;
    return a * b;
}

int main() {
    int n;
    cin >> n;
    morceaux.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> morceaux[i];
    }
    int i = 0;
    cout << evaluer(i) << "\n";
    return 0;
}
