#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<bool> vu(n + 1, false);
    long long paires = 0;
    for (int depart = 1; depart <= n; depart++) {
        if (vu[depart]) continue;
        // parcours en profondeur avec une pile : taille de la composante
        vu[depart] = true;
        vector<int> pile = {depart};
        long long taille = 0;
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
        paires += taille * (taille - 1) / 2;
    }
    cout << paires << "\n";
    return 0;
}
