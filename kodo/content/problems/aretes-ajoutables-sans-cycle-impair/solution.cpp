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
    vector<int> couleur(n + 1, -1);
    bool biparti = true;
    long long memes = (long long)n * (n - 1) / 2;  // paires de composantes différentes (on retire les autres)
    long long opposees = 0;                         // paires de couleurs différentes dans une même composante
    for (int depart = 1; depart <= n; depart++) {
        if (couleur[depart] != -1) continue;
        couleur[depart] = 0;
        long long nb[2] = {1, 0};                   // nombre de sommets de chaque couleur
        queue<int> file;
        file.push(depart);
        while (!file.empty()) {
            int u = file.front();
            file.pop();
            for (int v : voisins[u]) {
                if (couleur[v] == -1) {
                    couleur[v] = 1 - couleur[u];
                    nb[couleur[v]]++;
                    file.push(v);
                } else if (couleur[v] == couleur[u]) {
                    biparti = false;
                }
            }
        }
        long long s = nb[0] + nb[1];
        memes -= s * (s - 1) / 2;
        opposees += nb[0] * nb[1];
    }
    if (biparti) cout << memes + opposees - m << "\n";
    else cout << 0 << "\n";
    return 0;
}
