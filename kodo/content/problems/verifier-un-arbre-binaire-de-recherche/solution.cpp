#include <array>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> cle(n + 1);
    vector<int> gauche(n + 1), droite(n + 1);
    vector<bool> est_fils(n + 1, false);
    for (int i = 1; i <= n; i++) {
        cin >> cle[i] >> gauche[i] >> droite[i];
        est_fils[gauche[i]] = true;
        est_fils[droite[i]] = true;
    }
    int racine = 1;
    while (est_fils[racine]) racine++;
    const long long INFINI = 2000000000LL;
    bool correct = true;
    queue<array<long long, 3>> file;                 // la clé doit être dans ]bas, haut[
    file.push({racine, -INFINI, INFINI});
    while (!file.empty() && correct) {
        auto [v, bas, haut] = file.front();
        file.pop();
        if (!(bas < cle[v] && cle[v] < haut)) correct = false;
        if (gauche[v] != 0) file.push({gauche[v], bas, cle[v]});
        if (droite[v] != 0) file.push({droite[v], cle[v], haut});
    }
    cout << (correct ? "OUI" : "NON") << "\n";
    return 0;
}
