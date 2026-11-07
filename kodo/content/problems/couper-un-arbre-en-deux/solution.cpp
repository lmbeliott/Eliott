#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> poids(n + 1, 0);
    for (int v = 1; v <= n; v++) cin >> poids[v];
    vector<int> parent(n + 1, 0);
    vector<vector<int>> enfants(n + 1);
    for (int v = 2; v <= n; v++) {
        cin >> parent[v];
        enfants[parent[v]].push_back(v);
    }

    // Parcours en largeur depuis la racine : chaque sommet apparaît après son parent.
    vector<int> ordre = {1};
    for (size_t i = 0; i < ordre.size(); i++)
        for (int e : enfants[ordre[i]]) ordre.push_back(e);

    // En sens inverse, chaque sommet est traité après tous ses enfants.
    vector<long long> sous = poids;  // sous[v] = poids total du sous-arbre de v
    for (int i = n - 1; i >= 1; i--) sous[parent[ordre[i]]] += sous[ordre[i]];

    long long total = sous[1], meilleur = -1;
    int nombre = 0;
    for (int v = 2; v <= n; v++) {
        // Couper l'arête v — parent[v] sépare le sous-arbre de v du reste.
        long long ecart = total - 2 * sous[v];
        if (ecart < 0) ecart = -ecart;
        if (meilleur < 0 || ecart < meilleur) {
            meilleur = ecart;
            nombre = 1;
        } else if (ecart == meilleur) {
            nombre++;
        }
    }
    cout << meilleur << " " << nombre << "\n";
    return 0;
}
