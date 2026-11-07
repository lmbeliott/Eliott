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
    // nombre de composantes connexes
    vector<bool> vu(n + 1, false);
    int composantes = 0;
    for (int depart = 1; depart <= n; depart++) {
        if (vu[depart]) continue;
        composantes++;
        vu[depart] = true;
        vector<int> pile = {depart};
        while (!pile.empty()) {
            int u = pile.back();
            pile.pop_back();
            for (int v : voisins[u]) {
                if (!vu[v]) {
                    vu[v] = true;
                    pile.push_back(v);
                }
            }
        }
    }
    // une forêt à c composantes a exactement n - c arêtes
    cout << m - n + composantes << "\n";
    return 0;
}
