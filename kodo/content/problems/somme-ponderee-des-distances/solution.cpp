#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> c(n + 1, 0);
    for (int v = 1; v <= n; v++) cin >> c[v];
    vector<int> parent(n + 1, 0);
    vector<vector<int>> enfants(n + 1);
    for (int v = 2; v <= n; v++) {
        cin >> parent[v];
        enfants[parent[v]].push_back(v);
    }

    // Parcours en largeur depuis la racine : chaque sommet apparaît après son parent.
    vector<int> ordre = {1};
    vector<long long> profondeur(n + 1, 0);
    for (size_t i = 0; i < ordre.size(); i++) {
        int u = ordre[i];
        for (int v : enfants[u]) {
            profondeur[v] = profondeur[u] + 1;
            ordre.push_back(v);
        }
    }

    // poids[v] = somme des c[u] pour u dans le sous-arbre de v.
    vector<long long> poids = c;
    for (int i = n - 1; i >= 1; i--) poids[parent[ordre[i]]] += poids[ordre[i]];
    long long total = poids[1];

    // Racine : chaque u est à distance profondeur[u].
    vector<long long> reponse(n + 1, 0);
    for (int u = 1; u <= n; u++) reponse[1] += c[u] * profondeur[u];
    // Passer du parent p à son enfant v : le sous-arbre de v se rapproche de 1,
    // tout le reste s'éloigne de 1.
    for (int i = 1; i < n; i++) {
        int v = ordre[i];
        reponse[v] = reponse[parent[v]] + total - 2 * poids[v];
    }

    for (int v = 1; v <= n; v++) cout << reponse[v] << "\n";
    return 0;
}
