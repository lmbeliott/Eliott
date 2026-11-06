#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;

    // Listes d'adjacence : voisins[u] contient les refuges reliés à u.
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }

    vector<bool> vu(n + 1, false);
    int nbGroupes = 0, plusGrand = 0;
    vector<int> pile;
    for (int depart = 1; depart <= n; depart++) {
        if (vu[depart]) continue;
        // Nouveau groupe : on l'explore en entier avec une pile (DFS itératif).
        nbGroupes++;
        vu[depart] = true;
        pile.push_back(depart);
        int taille = 0;
        while (!pile.empty()) {
            int u = pile.back();
            pile.pop_back();
            taille++;
            for (int v : voisins[u]) {
                if (!vu[v]) {
                    vu[v] = true;
                    pile.push_back(v);
                }
            }
        }
        plusGrand = max(plusGrand, taille);
    }

    cout << nbGroupes << "\n" << plusGrand << "\n";
    return 0;
}
