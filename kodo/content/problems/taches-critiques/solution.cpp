#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<long long> duree(n + 1, 0);
    for (int v = 1; v <= n; v++) cin >> duree[v];
    vector<vector<int>> suivants(n + 1);
    vector<int> entrants(n + 1, 0);  // nombre de contraintes « avant moi » pas encore traitées
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        suivants[a].push_back(b);
        entrants[b]++;
    }

    // Ordre topologique (algorithme de Kahn) : on retire les tâches sans prérequis restant.
    vector<int> ordre;
    for (int v = 1; v <= n; v++)
        if (entrants[v] == 0) ordre.push_back(v);
    for (size_t i = 0; i < ordre.size(); i++) {
        int u = ordre[i];
        for (int v : suivants[u])
            if (--entrants[v] == 0) ordre.push_back(v);
    }
    if ((int)ordre.size() < n) {
        cout << -1 << "\n";  // certaines tâches restent bloquées : il y a un cycle
        return 0;
    }

    // debut[v] = date de début au plus tôt de v.
    vector<long long> debut(n + 1, 0);
    for (int u : ordre)
        for (int v : suivants[u]) debut[v] = max(debut[v], debut[u] + duree[u]);
    long long total = 0;
    for (int v = 1; v <= n; v++) total = max(total, debut[v] + duree[v]);

    // reste[v] = durée de la plus longue chaîne qui commence par v (v compris).
    vector<long long> reste(n + 1, 0);
    for (int i = n - 1; i >= 0; i--) {
        int u = ordre[i];
        long long meilleur = 0;
        for (int v : suivants[u]) meilleur = max(meilleur, reste[v]);
        reste[u] = duree[u] + meilleur;
    }

    // v est critique si une plus longue chaîne passe par v.
    int critiques = 0;
    for (int v = 1; v <= n; v++)
        if (debut[v] + reste[v] == total) critiques++;
    cout << total << " " << critiques << "\n";
    return 0;
}
