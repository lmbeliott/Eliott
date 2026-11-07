#include <iostream>
#include <string>
using namespace std;

// plus petit mot qu'on peut obtenir à partir de m
string meilleur(const string &m) {
    if (m.size() == 1) {
        return m;
    }
    int k = m.size() / 2;
    string g = meilleur(m.substr(0, k));
    string d = meilleur(m.substr(k));
    string a = g + d;
    string b = d + g;
    if (a < b) {
        return a;
    }
    return b;
}

int main() {
    string m;
    cin >> m;
    cout << meilleur(m) << "\n";
    return 0;
}
