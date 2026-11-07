#include <iostream>
#include <queue>
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
    // parcours en largeur depuis le sommet 1
    vector<int> dist(n + 1, -1);
    dist[1] = 0;
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int u = file.front();
        file.pop();
        for (int v : voisins[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                file.push(v);
            }
        }
    }
    int dmax = 0;
    for (int v = 1; v <= n; v++) dmax = max(dmax, dist[v]);
    vector<int> compte(dmax + 1, 0);
    int inaccessibles = 0;
    for (int v = 1; v <= n; v++) {
        if (dist[v] == -1) inaccessibles++;
        else compte[dist[v]]++;
    }
    for (int k = 0; k <= dmax; k++) cout << compte[k] << (k == dmax ? "\n" : " ");
    cout << inaccessibles << "\n";
    return 0;
}
