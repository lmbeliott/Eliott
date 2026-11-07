#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    int meilleur = n + 1;                 // aucun cycle ne dépasse n arêtes
    for (int s = 1; s <= n; s++) {
        // parcours en largeur depuis s
        vector<int> dist(n + 1, -1), parent(n + 1, 0);
        dist[s] = 0;
        queue<int> file;
        file.push(s);
        while (!file.empty()) {
            int u = file.front();
            file.pop();
            for (int v : voisins[u]) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    parent[v] = u;
                    file.push(v);
                } else if (v != parent[u]) {
                    // arête hors de l'arbre : un cycle d'au plus dist[u] + dist[v] + 1 arêtes
                    meilleur = min(meilleur, dist[u] + dist[v] + 1);
                }
            }
        }
    }
    cout << (meilleur <= n ? meilleur : -1) << "\n";
    return 0;
}
