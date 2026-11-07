#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    vector<long long> cpt(1001, 0);   // cpt[x] : apparitions de x déjà rencontrées
    long long paires = 0;
    for (int x : t) {
        paires = paires + cpt[x];     // x forme une paire avec chaque apparition précédente
        cpt[x] = cpt[x] + 1;
    }
    cout << paires << "\n";
    return 0;
}
