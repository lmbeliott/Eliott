#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;

    // total[nom] = somme des points reçus par la couleur.
    map<string, int> total;
    for (int i = 0; i < n; i++) {
        string nom;
        int points;
        cin >> nom >> points;
        total[nom] += points;  // une clé absente vaut 0 au départ
    }

    // On trie des couples (-total, nom) : le plus grand total d'abord,
    // puis, à total égal, l'ordre alphabétique.
    vector<pair<int, string>> classement;
    for (auto& p : total) {
        classement.push_back({-p.second, p.first});
    }
    sort(classement.begin(), classement.end());

    for (auto& c : classement) {
        cout << c.second << " " << -c.first << "\n";
    }
    return 0;
}
