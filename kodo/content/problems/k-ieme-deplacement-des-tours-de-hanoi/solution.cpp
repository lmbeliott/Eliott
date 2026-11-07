#include <iostream>
using namespace std;

// k-ième étape du déplacement d'une tour de n disques de a vers b (en se servant de c)
void trouver(int n, int a, int b, int c, long long k, int &disque, int &depart, int &arrivee) {
    long long m = 1LL << (n - 1);
    if (k == m) {
        disque = n;
        depart = a;
        arrivee = b;
    } else if (k < m) {
        trouver(n - 1, a, c, b, k, disque, depart, arrivee);
    } else {
        trouver(n - 1, c, b, a, k - m, disque, depart, arrivee);
    }
}

int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 0; i < q; i++) {
        long long k;
        cin >> k;
        int disque, depart, arrivee;
        trouver(n, 1, 3, 2, k, disque, depart, arrivee);
        cout << disque << " " << depart << " " << arrivee << "\n";
    }
    return 0;
}
