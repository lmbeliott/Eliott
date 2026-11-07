#include <iostream>
#include <vector>
#include <queue>
#include <utility>
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

    // Parcours en largeur sur les états (sommet, parité de la longueur) :
    // dist[p][v] = longueur minimale d'une marche de 1 à v dont la longueur a la parité p.
    const int INF = -1;
    vector<vector<int>> dist(2, vector<int>(n + 1, INF));
    dist[0][1] = 0;
    queue<pair<int, int>> file;
    file.push({1, 0});
    while (!file.empty()) {
        auto [u, p] = file.front();
        file.pop();
        for (int v : voisins[u]) {
            if (dist[1 - p][v] == INF) {
                dist[1 - p][v] = dist[p][u] + 1;
                file.push({v, 1 - p});
            }
        }
    }

    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int v;
        long long k;
        cin >> v >> k;
        long long d = dist[k % 2][v];
        // Une marche de longueur d se prolonge de 2 en faisant un aller-retour sur une arête,
        // à condition qu'il y ait une arête : le sommet 1 ne doit pas être isolé.
        bool possible = d != INF && d <= k && (k == d || !voisins[1].empty());
        cout << (possible ? "OUI" : "NON") << "\n";
    }
    return 0;
}
