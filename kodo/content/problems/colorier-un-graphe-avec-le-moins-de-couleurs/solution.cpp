#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int n;
vector<vector<int>> voisins;
vector<int> ordre, couleur;

// colorie ordre[i], ordre[i + 1], ... avec les couleurs 0 à k - 1
bool colorier(int i, int k, int utilisees) {
    if (i == n) return true;
    int v = ordre[i];
    vector<bool> interdite(k, false);
    for (int u : voisins[v])
        if (couleur[u] != -1) interdite[couleur[u]] = true;
    // les couleurs sont interchangeables : une nouvelle couleur est toujours la suivante
    for (int c = 0; c < min(k, utilisees + 1); c++) {
        if (!interdite[c]) {
            couleur[v] = c;
            if (colorier(i + 1, k, max(utilisees, c + 1))) return true;
            couleur[v] = -1;
        }
    }
    return false;
}

int main() {
    int m;
    cin >> n >> m;
    voisins.assign(n, {});
    for (int e = 0; e < m; e++) {
        int a, b;
        cin >> a >> b;
        voisins[a - 1].push_back(b - 1);
        voisins[b - 1].push_back(a - 1);
    }
    // on colorie d'abord les sommets de plus grand degré : les conflits apparaissent tôt
    for (int v = 0; v < n; v++) ordre.push_back(v);
    stable_sort(ordre.begin(), ordre.end(), [](int x, int y) { return voisins[x].size() > voisins[y].size(); });
    couleur.assign(n, -1);
    int k = 1;
    while (!colorier(0, k, 0)) k++;
    cout << k << "\n";
    return 0;
}
