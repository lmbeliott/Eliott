#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;

    // familles[signature] = liste des mots qui ont cette signature.
    // La signature d'un mot, ce sont ses lettres rangées dans l'ordre alphabétique :
    // deux anagrammes ont exactement la même.
    map<string, vector<string>> familles;
    for (int i = 0; i < n; i++) {
        string mot;
        cin >> mot;
        string signature = mot;
        sort(signature.begin(), signature.end());
        familles[signature].push_back(mot);
    }

    // Chaque famille est triée, puis on trie les familles entre elles
    // (deux vecteurs se comparent d'abord par leur premier élément).
    vector<vector<string>> resultat;
    for (auto& f : familles) {
        vector<string> groupe = f.second;
        sort(groupe.begin(), groupe.end());
        resultat.push_back(groupe);
    }
    sort(resultat.begin(), resultat.end());

    cout << resultat.size() << "\n";
    for (auto& groupe : resultat) {
        for (int i = 0; i < (int)groupe.size(); i++) {
            if (i > 0) cout << " ";
            cout << groupe[i];
        }
        cout << "\n";
    }
    return 0;
}
