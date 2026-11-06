#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool assez_de_pieces(long long minutes, const vector<long long>& durees, long long m) {
    // en `minutes` minutes, la machine de durée d fabrique minutes / d pièces
    long long total = 0;
    for (long long d : durees) {
        total += minutes / d;
        // on s'arrête dès qu'on a assez : sinon total pourrait dépasser 2^63
        if (total >= m) return true;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long m;
    cin >> n >> m;
    vector<long long> durees(n);
    for (int i = 0; i < n; i++) cin >> durees[i];

    // en 0 minute on n'a rien ; avec min(durees) * m minutes, la machine
    // la plus rapide fabrique à elle seule les m pièces
    long long trop_court = 0;
    long long suffisant = *min_element(durees.begin(), durees.end()) * m;
    while (suffisant - trop_court > 1) {
        long long milieu = trop_court + (suffisant - trop_court) / 2;
        if (assez_de_pieces(milieu, durees, m)) suffisant = milieu;
        else trop_court = milieu;
    }
    cout << suffisant << "\n";
    return 0;
}
