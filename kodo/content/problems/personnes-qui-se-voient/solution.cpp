#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> pile;     // tailles des personnes encore visibles depuis la droite (décroissantes)
    long long paires = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        while (!pile.empty() && pile.back() < x) {
            pile.pop_back();         // cette personne voit x, puis sera cachée par x
            paires++;
        }
        if (!pile.empty()) {
            paires++;                // la première personne plus grande que x
        }
        pile.push_back(x);
    }
    cout << paires << "\n";
    return 0;
}
