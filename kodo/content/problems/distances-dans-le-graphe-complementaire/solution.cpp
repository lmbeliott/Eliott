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
    vector<int> dist(n + 1, -1);
    dist[1] = 0;
    vector<int> restants;                 // sommets pas encore découverts
    for (int v = 2; v <= n; v++) restants.push_back(v);
    vector<bool> marque(n + 1, false);
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int u = file.front();
        file.pop();
        for (int v : voisins[u]) marque[v] = true;
        vector<int> garde;
        for (int v : restants) {
            if (marque[v]) {
                garde.push_back(v);       // voisin de u dans G : pas voisin dans le complémentaire
            } else {
                dist[v] = dist[u] + 1;
                file.push(v);
            }
        }
        restants = garde;
        for (int v : voisins[u]) marque[v] = false;
    }
    for (int v = 1; v <= n; v++) cout << dist[v] << (v == n ? "\n" : " ");
    return 0;
}
