#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> gauche(n + 1), droite(n + 1);
    vector<bool> est_fils(n + 1, false);
    for (int i = 1; i <= n; i++) {
        cin >> gauche[i] >> droite[i];
        est_fils[gauche[i]] = true;
        est_fils[droite[i]] = true;
    }
    int racine = 1;
    while (est_fils[racine]) racine++;
    vector<int> visibles;
    queue<pair<int, int>> file;
    file.push({racine, 0});
    while (!file.empty()) {
        auto [v, niveau] = file.front();
        file.pop();
        if (niveau == (int)visibles.size()) visibles.push_back(v);   // premier nœud de ce niveau
        for (int f : {gauche[v], droite[v]})                          // gauche d'abord
            if (f != 0) file.push({f, niveau + 1});
    }
    for (int i = 0; i < (int)visibles.size(); i++) cout << visibles[i] << (i + 1 == (int)visibles.size() ? "\n" : " ");
    return 0;
}
