#include <algorithm>
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

    vector<int> couleur(n + 1, -1);  // -1 : pas encore colorié
    vector<int> file;
    long long total = 0;
    for (int depart = 1; depart <= n; depart++) {
        if (couleur[depart] != -1) continue;
        // Coloriage de la composante de « depart » en alternant 0 et 1.
        couleur[depart] = 0;
        int compte[2] = {1, 0};
        file.assign(1, depart);
        for (size_t tete = 0; tete < file.size(); tete++) {
            int u = file[tete];
            for (int v : voisins[u]) {
                if (couleur[v] == -1) {
                    couleur[v] = 1 - couleur[u];
                    compte[couleur[v]]++;
                    file.push_back(v);
                } else if (couleur[v] == couleur[u]) {
                    // Deux voisins de même couleur : cycle impair, aucun partage possible.
                    cout << -1 << "\n";
                    return 0;
                }
            }
        }
        // Inès prend la plus petite des deux couleurs de cette composante.
        total += min(compte[0], compte[1]);
    }

    cout << total << "\n";
    return 0;
}
