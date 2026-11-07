#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<long long> valeurs;   // pile des valeurs déjà calculées
vector<char> ops;            // pile des opérateurs et des parenthèses ouvrantes

int priorite(char o) {
    return o == '*' ? 2 : 1;
}

void appliquer() {
    char o = ops.back();
    ops.pop_back();
    long long b = valeurs.back();   // second opérande
    valeurs.pop_back();
    long long a = valeurs.back();   // premier opérande
    valeurs.pop_back();
    if (o == '+') {
        valeurs.push_back(a + b);
    } else if (o == '-') {
        valeurs.push_back(a - b);
    } else {
        valeurs.push_back(a * b);
    }
}

int main() {
    string s;
    cin >> s;
    int n = s.size();
    int i = 0;
    while (i < n) {
        char c = s[i];
        if (c >= '0' && c <= '9') {
            long long x = 0;
            while (i < n && s[i] >= '0' && s[i] <= '9') {   // lire tous les chiffres du nombre
                x = 10 * x + (s[i] - '0');
                i++;
            }
            valeurs.push_back(x);
            continue;
        }
        if (c == '(') {
            ops.push_back(c);
        } else if (c == ')') {
            while (ops.back() != '(') {
                appliquer();
            }
            ops.pop_back();                                  // retirer la parenthèse ouvrante
        } else {
            // appliquer d'abord les opérateurs de priorité supérieure ou égale
            while (!ops.empty() && ops.back() != '(' && priorite(ops.back()) >= priorite(c)) {
                appliquer();
            }
            ops.push_back(c);
        }
        i++;
    }
    while (!ops.empty()) {
        appliquer();
    }
    cout << valeurs[0] << "\n";
    return 0;
}
