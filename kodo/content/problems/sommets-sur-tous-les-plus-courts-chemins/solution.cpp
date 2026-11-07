#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// parcours en largeur : distance (en nombre d'arêtes) depuis « depart », -1 si inaccessible
vector<int> distances(int depart, const vector<vector<int>>& voisins, int n) {
    vector<int> dist(n + 1, -1);
    dist[depart] = 0;
    queue<int> file;
    file.push(depart);
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
    return dist;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }

    vector<int> depuis_s = distances(s, voisins, n);
    vector<int> depuis_t = distances(t, voisins, n);
    int d = depuis_s[t];
    if (d == -1) {
        cout << -1 << "\n";
        return 0;
    }

    // Un sommet v est sur un plus court chemin si depuis_s[v] + depuis_t[v] == d.
    // Chaque plus court chemin passe par exactement un tel sommet à chaque distance k de s.
    vector<int> sur_un_chemin;
    for (int v = 1; v <= n; v++) {
        if (depuis_s[v] != -1 && depuis_t[v] != -1 && depuis_s[v] + depuis_t[v] == d) sur_un_chemin.push_back(v);
    }
    vector<int> par_distance(d + 1, 0);
    for (int v : sur_un_chemin) par_distance[depuis_s[v]]++;
    // v est sur tous les plus courts chemins s'il est le seul à sa distance
    vector<int> obligatoires;
    for (int v : sur_un_chemin) {
        if (par_distance[depuis_s[v]] == 1) obligatoires.push_back(v);
    }

    cout << obligatoires.size() << "\n";
    for (size_t i = 0; i < obligatoires.size(); i++) cout << (i ? " " : "") << obligatoires[i];
    cout << "\n";
    return 0;
}
